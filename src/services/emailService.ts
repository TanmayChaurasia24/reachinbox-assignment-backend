const API_BASE_URL = 'http://localhost:3000/api/emails';

export interface Email {
  id?: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  folder: string;
  account: string;
  content: string;
}

export interface FetchEmailsRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  title: string;
  description?: string;
  emails?: T[];
  error?: string;
}

export const emailService = {
  // Fetch emails from IMAP
  async fetchEmails(credentials: FetchEmailsRequest): Promise<ApiResponse<Email>> {
    try {
      const response = await fetch(`${API_BASE_URL}/fetch-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  },

  // Get all emails
  async getAllEmails(): Promise<ApiResponse<Email>> {
    try {
      const response = await fetch(`${API_BASE_URL}/allemails`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting all emails:', error);
      throw error;
    }
  },

  // Search emails
  async searchEmails(query: string): Promise<{ emails: Email[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching emails:', error);
      throw error;
    }
  },

  // Delete all emails
  async deleteAllEmails(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/all`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting emails:', error);
      throw error;
    }
  },
};