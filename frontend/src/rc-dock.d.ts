declare module 'rc-dock' {
  import { Component, ReactNode, RefObject } from 'react';

  export interface TabData {
    id: string;
    title?: string;
    content?: ReactNode;
    cached?: boolean;
    closable?: boolean;
    group?: string;
  }

  export interface PanelData {
    tabs?: TabData[];
    panelLock?: any;
    id?: string;
  }

  export interface BoxData {
    mode?: 'horizontal' | 'vertical';
    children?: (PanelData | BoxData)[];
    id?: string;
  }

  export interface LayoutData {
    dockbox?: BoxData;
    floatbox?: BoxData;
    maxbox?: BoxData;
  }

  export interface DockLayoutProps {
    layout?: LayoutData;
    defaultLayout?: LayoutData;
    loadTab?: (data: TabData) => TabData;
    saveTab?: (data: TabData) => TabData;
    onLayoutChange?: (layout: LayoutData, currentTabId?: string, direction?: string) => void;
    style?: React.CSSProperties;
    groups?: any;
  }

  export default class DockLayout extends Component<DockLayoutProps> {
    dockMove(source: TabData | string, target: string | null, direction: string): void;
    updateTab(id: string, tab: TabData): void;
  }
}
