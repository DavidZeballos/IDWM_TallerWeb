import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [AuthRoutingModule], // Solo se importa el módulo de rutas
})
export class AuthModule {}
