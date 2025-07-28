import { useEffect, useState } from 'react';

// Interface for log data based on new API response structure
export interface LogEntry {
  time: string;
  user_name: string;
  user_role: string;
  log_level: string;
  code: number;
  message: string;
  service_name: string;
  date: string;
}

export interface LogData {
  statusCode: number;
  headers: {
    "Content-Type": string;
    "Access-Control-Allow-Origin": string;
  };
  body: LogEntry[];
}

export interface BillingEntry {
  date: string;
  cost: number;
}

export const useAdminData = () => {
  const [logData, setLogData] = useState<LogData | null>(null);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logError, setLogError] = useState<string | null>(null);
  
  // Billing states
  const [billingData, setBillingData] = useState<BillingEntry[] | null>(null);
  const [isLoadingBilling, setIsLoadingBilling] = useState(true);
  const [billingError, setBillingError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch logs from API
  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    setLogError(null);
    
    try {
      // Get the vpbank_id_token from localStorage or sessionStorage
      const vpbankToken = localStorage.getItem('vpbank_id_token') || sessionStorage.getItem('vpbank_id_token');
      
      if (!vpbankToken) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`${BASE_URL}/admin/log`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vpbankToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Parse the body string as JSON if it's a string
      let parsedBody;
      if (typeof result.body === 'string') {
        parsedBody = JSON.parse(result.body);
      } else {
        parsedBody = result.body;
      }
      
      const processedResult: LogData = {
        statusCode: result.statusCode,
        headers: result.headers,
        body: parsedBody
      };
      
      setLogData(processedResult);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogError(error instanceof Error ? error.message : 'Failed to fetch logs');
      
      // Set mock data as fallback for development
      setLogData({
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: [
          {
            time: "09:47:09",
            user_name: "adminuser@gmail.com",
            user_role: "Admin",
            log_level: "INFO",
            code: 200,
            message: "Đã nhận phản hồi từ Agent thành công !",
            service_name: "bedrock_agent",
            date: "28-07-2025"
          },
          {
            time: "22:54:58",
            user_name: "adminuser@gmail.com",
            user_role: "Admin",
            log_level: "INFO",
            code: 200,
            message: "Đã nhận phản hồi từ Agent thành công !",
            service_name: "bedrock_agent",
            date: "27-07-2025"
          },
          {
            time: "21:53:11",
            user_name: "adminuser@gmail.com",
            user_role: "Admin",
            log_level: "INFO",
            code: 200,
            message: "Đã nhận phản hồi từ Agent thành công !",
            service_name: "bedrock_agent",
            date: "27-07-2025"
          },
          {
            time: "16:52:56",
            user_name: "dump_user",
            user_role: "User",
            log_level: "ERROR",
            code: 500,
            message: "Database connection timeout after 30 seconds",
            service_name: "api_gateway",
            date: "27-07-2025"
          },
          {
            time: "16:51:35",
            user_name: "dump_user",
            user_role: "User",
            log_level: "INFO",
            code: 200,
            message: "Request processed successfully",
            service_name: "lambda_function",
            date: "27-07-2025"
          }
        ]
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Fetch billing data from API
  const fetchBilling = async () => {
    setIsLoadingBilling(true);
    setBillingError(null);
    
    try {
      // Get the vpbank_id_token from localStorage or sessionStorage
      const vpbankToken = localStorage.getItem('vpbank_id_token') || sessionStorage.getItem('vpbank_id_token');
      
      if (!vpbankToken) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`${BASE_URL}/billing`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vpbankToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // API response có cấu trúc { body: [{ date, cost }, ...] }
      if (result.body && Array.isArray(result.body)) {
        setBillingData(result.body);
      } else if (Array.isArray(result)) {
        setBillingData(result);
      } else {
        throw new Error('Invalid billing data format');
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
      setBillingError(error instanceof Error ? error.message : 'Failed to fetch billing data');
      // Set mock data as fallback
      setBillingData([
        { date: "2025-07-01", cost: 6.2 },
        { date: "2025-07-02", cost: 0 },
        { date: "2025-07-03", cost: 8.5 },
        { date: "2025-07-04", cost: 12.3 },
        { date: "2025-07-05", cost: 15.7 },
        { date: "2025-07-06", cost: 9.1 },
        { date: "2025-07-07", cost: 11.4 },
        { date: "2025-07-08", cost: 7.8 },
        { date: "2025-07-09", cost: 13.2 },
        { date: "2025-07-10", cost: 10.6 },
        { date: "2025-07-11", cost: 14.9 },
        { date: "2025-07-12", cost: 8.3 },
        { date: "2025-07-13", cost: 16.1 },
        { date: "2025-07-14", cost: 12.7 },
        { date: "2025-07-15", cost: 9.5 },
        { date: "2025-07-16", cost: 11.8 },
        { date: "2025-07-17", cost: 13.6 }
      ]);
    } finally {
      setIsLoadingBilling(false);
    }
  };

  // Load logs and billing data on component mount
  useEffect(() => {
    fetchLogs();
    fetchBilling();
  }, []);

  return {
    // Log data
    logData,
    isLoadingLogs,
    logError,
    fetchLogs,
    
    // Billing data
    billingData,
    isLoadingBilling,
    billingError,
    fetchBilling,
  };
};
