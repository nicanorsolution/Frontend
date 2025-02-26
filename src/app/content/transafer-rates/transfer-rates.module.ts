import { NgModule } from '@angular/core';
import { SharedModule } from '../../helpers/share.module';
import { TransferRatesService } from './services/transfer-rates.services';
import { TransferRatesRoutingModule } from './transfer-rates-routing.module';
import { StandardRatesComponent } from './standard-rates/standard-rates.component';
import { SpecialCorporateRatesComponent } from './special-corporate-rates/special-corporate-rates.component';
import { SpecialIndividualRatesComponent } from './special-individual-rates/special-individual-rates.component';
import { SwiftcodesComponent } from './swiftcodes/swiftcodes.component';
import { SwiftCodeService } from './services/swiftcode.services';

@NgModule({
  declarations: [
    StandardRatesComponent,
    SpecialCorporateRatesComponent,
    SpecialIndividualRatesComponent,
    SwiftcodesComponent
  ],
  imports: [
    SharedModule,
    TransferRatesRoutingModule
  ],
  providers: [
    TransferRatesService,
    SwiftCodeService
  ]
})
export class TransferRatesModule { }
