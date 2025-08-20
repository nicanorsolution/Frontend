import { Component, OnInit } from '@angular/core';
import { AuthService } from '../content/users/auth.service';
import { UserRoleEnum, UserType } from '../helpers/UserRoleEnum';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles : number[];
    userType: number[];
}
export const ROUTES: RouteInfo[] = [
    {
    path: '/admin/dashboard', title: 'Dashboard', icon: 'pe-7s-graph', class: '',
    roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },
  {
    path: '/admin/transaction/create-transaction', title: 'New Importation', icon: 'pe-7s-play', class: '',
    roles: [UserRoleEnum.TradeInitiator],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },
  {
    path: '/admin/transaction/view-transaction', title: 'View Importations', icon: 'pe-7s-search', class: '',
    roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },
  {
    path: '/admin/exportations/create-exportation', title: 'New Exportation', icon: 'pe-7s-upload', class: '',
    roles: [UserRoleEnum.TradeInitiator],
    userType: [UserType.InternalUser]
  },
  {
    path: '/admin/exportations/view-exportations', title: 'View Exportations', icon: 'pe-7s-display2', class: '',
    roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },
  {
    path: '/admin/customer/corporate', title: 'Corporates', icon: 'pe-7s-culture', class: '',
     roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser]
  },
  {
    path: '/admin/customer/individual', title: 'Individuals', icon: 'pe-7s-add-user', class: '',
     roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser]
  },
  {
    path: '/admin/customer/rm', title: 'Relation Manager', icon: 'pe-7s-share', class: '',
     roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser]
  },
  {
    path: '/admin/documentation/document', title: 'Documents', icon: 'pe-7s-file', class: '',
     roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },
  {
    path: '/admin/documentation/transaction-type', title: 'Transfers Type', icon: 'pe-7s-folder', class: '',
     roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },

  {
    path: '/admin/rates/standard-rates', title: 'Standard Rates', icon: 'pe-7s-anchor', class: '',
     roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },

  {
    path: '/admin/rates/special-corporate-rates', title: 'Corporate Pricing', icon: 'pe-7s-calculator', class: '',
     roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser]
  },

  {
    path: '/admin/rates/special-individual-rates', title: 'Individual Pricing', icon: 'pe-7s-calculator', class: '',
     roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser]
  },
  {
    path: '/admin/rates/swiftcodes', title: 'Swift Codes', icon: 'pe-7s-settings', class: '',
    roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },

  {
    path: '/admin/di/di', title: 'Import Domiciliation', icon: 'pe-7s-info', class: '',
    roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },
  {
    path: '/admin/de/de', title: 'Export Domiciliation', icon: 'pe-7s-info', class: '',
    roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser, UserType.ExternalUser]
  },
  { path: '/admin/users', title: 'User Profile',  icon:'pe-7s-user', class: '' ,
   roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser,UserType.ExternalUser]
  },
  {
    path: '/admin/reports', title: 'Reports', icon: 'pe-7s-graph3', class: '',
    roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
            UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
            UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
            UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
    userType: [UserType.InternalUser]
  },

];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
  mainMenuItems: any[] = [];
  customerMenuItems: any[] = [];
  pricingMenuItems: any[] = [];
  dideMenuItems: any[] = [];
  configMenuItems: any[] = [];

  constructor(private readonly authService: AuthService) { }

  ngOnInit() {
    const userRole = this.authService.getUserRole();
    const userType = this.authService.getUserType();

    this.menuItems = ROUTES.filter(menuItem => {
      if (userRole === null || userType === null) {
        return false;
      }

      const hasRole =  menuItem.roles.includes(userRole);
      const hasUserType = menuItem.userType.includes(userType);

      return hasRole && hasUserType;
    });
    this.organizeMenuItems();
  }

  organizeMenuItems() {
    // Main Operations
    this.mainMenuItems = this.menuItems.filter(item =>
      item.path.includes('dashboard') ||
      item.path.includes('transaction/create-transaction') ||
      item.path.includes('transaction/view-transaction') ||
      item.path.includes('exportations/create-exportation') ||
      item.path.includes('exportations/view-exportations')
    );

    // Customer Management
    this.customerMenuItems = this.menuItems.filter(item =>
      item.path.includes('customer/corporate') ||
      item.path.includes('customer/individual') ||
      item.path.includes('customer/rm')
    );

    // Pricing
    this.pricingMenuItems = this.menuItems.filter(item =>
      item.path.includes('rates/special-corporate-rates') ||
      item.path.includes('rates/special-individual-rates') ||
      item.path.includes('rates/standard-rates')
    );

    // Domiciliation Import/Export
    this.dideMenuItems = this.menuItems.filter(item =>
      item.path.includes('/di/') ||
      item.path.includes('/de/')
    );

    // Configuration & Admin
    this.configMenuItems = this.menuItems.filter(item =>
      item.path.includes('documentation') ||
      item.path.includes('users') ||
      item.path.includes('reports')
    );
  }

  isMobileMenu() {
      if (window.innerWidth > 991) {
          return false;
      }
      return true;
  }
}
