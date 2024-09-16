import { Navbar } from "./navbar";

export abstract class NavbarProvider {
  abstract getNavbar(): Navbar;
}
