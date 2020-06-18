/* eslint-disable */
import axios from 'axios'
import apiErrorHandler from './api-error-handler';

const baseUrl = process.env.VUE_APP_API_URL;

export default class QuotesService {

  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async defineHeaderAxios() {
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.accessToken
    axios.defaults.withCredentials = true
  }

  async getQueues() {
    const url = `${baseUrl}/queues`;
    return apiErrorHandler('[QuotesService.getQueues]', async () => {
      this.defineHeaderAxios()
      const { data } = await axios.get(url)
      return data;
    });
  }

  async getQueueMessages(queueName) {
    const url = `${baseUrl}/queues/${queueName}`;
    return apiErrorHandler('[QuotesService.getQueueMessages]', async () => {
      this.defineHeaderAxios()
      const { data } = await axios.get(url)
      return data;
    });
  }

}
