import React from "react";

export interface CommonProps{
    className? : React.HTMLAttributes<HTMLElement>['className']
    style? : React.HTMLAttributes<HTMLElement>['style']
    children? : React.ReactNode
}