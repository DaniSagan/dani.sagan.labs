import { NavbarItem } from "./navbar-item";

export interface NavbarSubsection {
  name: string;
  items: NavbarItem[];
  /** Grupos hijos; se pueden anidar tantos niveles como necesite el catálogo. */
  subsections?: NavbarSubsection[];
}
