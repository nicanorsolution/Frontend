import { Component, OnInit } from '@angular/core';
import { RolePermissions } from '../helpers/utilities-methods.class';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles : string[];
}
export const ROUTES: RouteInfo[] = [
    {
    path: '/admin/dashboard', title: 'Dashboard', icon: 'pe-7s-graph', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
  {
    path: '/admin/transaction/create-transaction', title: 'New Transaction', icon: 'pe-7s-play', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
  {
    path: '/admin/transaction/view-transaction', title: 'View Transactions', icon: 'pe-7s-search', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
  {
    path: '/admin/exportations/create-exportation', title: 'New Exportation', icon: 'pe-7s-upload', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
  {
    path: '/admin/exportations/view-exportations', title: 'View Exportations', icon: 'pe-7s-display2', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
  {
    path: '/admin/customer/corporate', title: 'Corporates', icon: 'pe-7s-culture', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
  {
    path: '/admin/customer/individual', title: 'Individuals', icon: 'pe-7s-add-user', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
  {
    path: '/admin/customer/rm', title: 'Relation Manager', icon: 'pe-7s-share', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
    {
    path: '/admin/documentation/document', title: 'Documents', icon: 'pe-7s-file', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
    },
  {
    path: '/admin/documentation/transaction-type', title: 'Transfers Type', icon: 'pe-7s-folder', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },

  {
    path: '/admin/rates/standard-rates', title: 'Standard Rates', icon: 'pe-7s-anchor', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },

  {
    path: '/admin/rates/special-corporate-rates', title: 'Corporate Pricing', icon: 'pe-7s-calculator', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },

  {
    path: '/admin/rates/special-individu-rates', title: 'Individual Pricing', icon: 'pe-7s-calculator', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
  {
    path: '/admin/rates/swiftcodes', title: 'Swift Codes', icon: 'pe-7s-settings', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },

  {
    path: '/admin/di/di', title: 'Import Domiciliation', icon: 'pe-7s-info', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },
  {
    path: '/admin/de/de', title: 'Export Domiciliation', icon: 'pe-7s-info', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },

    { path: '/admin/users', title: 'User Profile',  icon:'pe-7s-user', class: '' , roles : [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
                                                                                              RolePermissions.AuditControlRole,RolePermissions.OperationRole,RolePermissions.ChannelUserRole,
    ] },

  {
    path: '/admin/reports', title: 'Reports', icon: 'pe-7s-graph3', class: '', roles: [RolePermissions.AdministratorRole, RolePermissions.SuperAdministratorRole,
    RolePermissions.AuditControlRole, RolePermissions.OperationRole, RolePermissions.ChannelUserRole,
    ]
  },

];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[]= [];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
     /*  if ($(window).width() > 991) {
          return false;
      } */
      return false;
  };
}
