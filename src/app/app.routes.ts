import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ManualLogin } from '@features/auth/manual-login/manual-login';
import { RfidLogin } from '@features/auth/rfid-login/rfid-login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login/manual', component: ManualLogin },
  { path: 'login/rfid', component: RfidLogin },
  { path: '**', redirectTo: '' }
];