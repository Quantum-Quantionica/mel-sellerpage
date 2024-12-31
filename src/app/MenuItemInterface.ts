import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ReactNode } from "react";

export default interface MenuItem {
    name: string;
    link: string;
    params?: string;
    icon: IconDefinition;
    page?: ReactNode;
}