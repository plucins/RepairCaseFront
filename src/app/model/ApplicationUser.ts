import {logging} from 'selenium-webdriver';

export class ApplicationUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  token: string;
}
