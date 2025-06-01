import axios from 'axios';

const ACCESS_TOKEN = process.env.REACT_APP_SF_ACCESS_TOKEN;
const INSTANCE_URL = process.env.REACT_APP_SF_INSTANCE_URL;

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

// Helper function to handle errors with more detailed logging
const handleError = (error, context) => {
  console.error(`Error in ${context}:`, {
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    message: error.message,
    url: error.config?.url,
    method: error.config?.method
  });
  throw error;
};

// Helper function to validate environment variables
const validateEnvironment = () => {
  if (!ACCESS_TOKEN) {
    throw new Error('REACT_APP_SF_ACCESS_TOKEN is not defined in environment variables');
  }
  if (!INSTANCE_URL) {
    throw new Error('REACT_APP_SF_INSTANCE_URL is not defined in environment variables');
  }
};

export const addProvider = async (providerData) => {
  try {
    validateEnvironment();
    
    // Ensure required fields are present
    const requiredFields = ['Name', 'Type__c', 'Wedding__c'];
    const missingFields = requiredFields.filter(field => !providerData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    console.log('Adding provider with data:', providerData);

    const response = await axios.post(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c`,
      providerData,
      { headers }
    );
    
    console.log('Provider added successfully:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'addProvider');
  }
};

export const getWeddingById = async (weddingId) => {
  try {
    validateEnvironment();
    
    if (!weddingId) {
      throw new Error('Wedding ID is required');
    }

    console.log(`Fetching wedding with ID: ${weddingId}`);

    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Wedding__c/${weddingId}`,
      { headers }
    );
    
    console.log('Wedding fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'getWeddingById');
  }
};

export const deleteProvider = async (providerId) => {
  try {
    validateEnvironment();
    
    if (!providerId) {
      throw new Error('Provider ID is required');
    }

    console.log(`Deleting provider with ID: ${providerId}`);

    await axios.delete(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c/${providerId}`,
      { headers }
    );
    
    console.log('Provider deleted successfully');
    return true;
  } catch (error) {
    handleError(error, 'deleteProvider');
  }
};

export const handleCoupleResponse = async (providerId, responseValue) => {
  try {
    validateEnvironment();
    
    if (!providerId) {
      throw new Error('Provider ID is required');
    }
    if (!responseValue) {
      throw new Error('Response value is required');
    }

    console.log(`Updating provider ${providerId} with response: ${responseValue}`);

    const response = await axios.patch(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c/${providerId}`,
      { Couple_Response__c: responseValue },
      { headers }
    );
    
    console.log('Provider response updated successfully:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'handleCoupleResponse');
  }
};

export const getProvidersByWeddingId = async (weddingId) => {
  try {
    validateEnvironment();
    
    if (!weddingId) {
      throw new Error('Wedding ID is required');
    }

    console.log(`Fetching providers for wedding ID: ${weddingId}`);

    const query = `SELECT Id,Name,Type__c,Phone__c,Status__c,Couple_Response__c,Price__c,Availability__c,ServiceQuality__c,References__c,Wedding__c 
                   FROM Provider__c 
                   WHERE Wedding__c='${weddingId}'`;
    
    const encodedQuery = encodeURIComponent(query);
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v60.0/query/?q=${encodedQuery}`,
      { headers }
    );
    
    console.log(`Found ${response.data.records.length} providers for wedding ${weddingId}`);
    return response.data.records;
  } catch (error) {
    handleError(error, 'getProvidersByWeddingId');
  }
};

export const lockProvidersInSalesforce = async (weddingId) => {
  try {
    validateEnvironment();
    
    if (!weddingId) {
      throw new Error('Wedding ID is required');
    }

    console.log(`Starting provider lock process for wedding ID: ${weddingId}`);

    // Step 1: Check if providers are already locked
    const currentWedding = await getWeddingById(weddingId);
    if (currentWedding.Providers_Locked__c) {
      console.log('Providers are already locked for this wedding');
      return [{ success: true, message: 'Providers were already locked' }];
    }

    // Step 2: Get current providers to validate
    const providers = await getProvidersByWeddingId(weddingId);
    if (providers.length === 0) {
      throw new Error('Cannot lock providers: No providers found for this wedding');
    }

    console.log(`Found ${providers.length} providers to lock`);

    // Step 3: Lock the wedding (update Providers_Locked__c to true)
    console.log('Step 1: Locking wedding record...');
    const lockResponse = await axios.patch(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Wedding__c/${weddingId}`,
      { Providers_Locked__c: true },
      { headers }
    );
    
    console.log('Wedding locked successfully:', lockResponse.status);

    // Step 4: Trigger the flow (with better error handling)
    console.log('Step 2: Triggering Couple Choice flow...');
    
    try {
      const flowResponse = await axios.post(
        `${INSTANCE_URL}/services/data/v60.0/actions/custom/flow/Couple_s_Choice`,
        {
          inputs: [{
            weddingId: weddingId
          }]
        },
        { 
          headers,
          timeout: 30000 // 30 second timeout for flow execution
        }
      );

      console.log('Flow triggered successfully:', flowResponse.data);
      return flowResponse.data;

    } catch (flowError) {
      console.error('Flow execution failed:', flowError.response?.data || flowError.message);
      
      // If flow fails, we still consider the lock successful since the wedding is locked
      // The flow failure might be due to email service issues, not core functionality
      console.warn('Warning: Wedding is locked but flow execution failed. Manual email sending may be required.');
      
      return [{
        success: true,
        message: 'Wedding locked successfully, but email notification may have failed. Please verify manually.',
        flowError: flowError.response?.data || flowError.message
      }];
    }

  } catch (error) {
    console.error('Lock process failed:', error);
    
    // If locking failed, try to rollback (unlock the wedding)
    if (error.message !== 'Wedding ID is required') {
      try {
        console.log('Attempting to rollback wedding lock...');
        await axios.patch(
          `${INSTANCE_URL}/services/data/v60.0/sobjects/Wedding__c/${weddingId}`,
          { Providers_Locked__c: false },
          { headers }
        );
        console.log('Rollback successful');
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }
    
    handleError(error, 'lockProvidersInSalesforce');
  }
};
export const validateCoupleChoices = async (weddingId) => {
  try {
    // Utilisation directe de l'API Salesforce REST
    const response = await fetch(`${INSTANCE_URL}/services/data/v58.0/sobjects/Wedding__c/${weddingId}`, {
      method: 'PATCH',
     
      body: JSON.stringify({
        'Choix_Valides__c': true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur Salesforce: ${response.status} - ${errorData[0]?.message || response.statusText}`);
    }

    console.log('Choix du couple validés avec succès dans Salesforce');
    return { success: true, message: 'Choix validés' };
  } catch (error) {
    console.error('Erreur lors de la validation dans Salesforce:', error);
    throw error;
  }
};

// Additional utility function to check connection
export const testConnection = async () => {
  try {
    validateEnvironment();
    
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v60.0/`,
      { headers }
    );
    
    console.log('Salesforce connection test successful:', response.status);
    return true;
  } catch (error) {
    console.error('Salesforce connection test failed:', error);
    return false;
  }
};