declare module '@tawk.to/tawk-messenger-react' {
  import { ForwardRefExoticComponent, RefAttributes } from 'react';

  interface TawkMessengerReactProps {
    propertyId: string;
    widgetId: string;
    onLoad?: () => void;
    onStatusChange?: (status: string) => void;
    onChatMaximized?: () => void;
    onChatMinimized?: () => void;
    onChatHidden?: () => void;
    onChatStarted?: () => void;
    onChatEnded?: () => void;
    onPrechatSubmit?: (data: any) => void;
    onOfflineSubmit?: (data: any) => void;
    onChatMessageVisitor?: (message: string) => void;
    onChatMessageAgent?: (message: string) => void;
    onChatMessageSystem?: (message: string) => void;
    onAgentJoinChat?: (data: any) => void;
    onAgentLeaveChat?: (data: any) => void;
    onChatSatisfaction?: (satisfaction: string) => void;
    onVisitorNameChanged?: (visitorName: string) => void;
    onFileUpload?: (link: string) => void;
    onTagsUpdated?: (tags: string[]) => void;
    onUnreadCountChanged?: (count: number) => void;
    customStyle?: any;
    basePath?: string;
    embedId?: string;
  }

  const TawkMessengerReact: ForwardRefExoticComponent<
    TawkMessengerReactProps & RefAttributes<any>
  >;

  export default TawkMessengerReact;
}
