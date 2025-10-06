import { GestureResponderEvent } from "react-native";

declare interface MenuCardProp {
  title: string;
  icon: ImageSourcePropType | undefined;
  color: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  enterAnimation: any | undefined;
}

declare interface User {
  email: String;
  username: String;
}
declare interface UserReducerInitial {
  user: User | null;
  loading: boolean;
  error: string | false;
}
