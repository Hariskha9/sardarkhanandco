import { Routes } from '@angular/router';
import { Body } from './layout/body/body';
import { Homepage } from './pages/homepage/homepage';

export const routes: Routes = [
    {path:'', component: Body, children:[
            {path:'', component:Homepage},

    ]}
];
