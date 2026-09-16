/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    user: any;
    admin: any;
    adminSurface: boolean;
    anon: string;
    csrf: string;
    presentation: any;
  }
}
