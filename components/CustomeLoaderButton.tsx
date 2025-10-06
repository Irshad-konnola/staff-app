import {
  ActivityIndicator,
  GestureResponderEvent,
  TouchableHighlight,
} from "react-native";
import { Text } from "./Text";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { View } from "./Themed";

type LoaderButtonProps = {
  isLoading: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  className?: string;
};
export const CustomeLoaderButton = ({
  children,
  className,
  onPress,
  isLoading,
}: LoaderButtonProps & PropsWithChildren) => {
  return (
    <TouchableHighlight
      disabled={isLoading}
      onPress={onPress}
      className={cn(
        "w-full h-14 mt-5 flex justify-center items-center bg-primary space-x-3 ",
        className,
        {
          "opacity-60": isLoading,
        }
      )}
    >
      <View className="flex flex-row space-x-4">
        <Text
          className="text-white text-[18px] uppercase"
          fontFamily="KumbhSans-Medium"
        >
          {children}
        </Text>
        {isLoading && <ActivityIndicator size={24} />}
      </View>
    </TouchableHighlight>
  );
};
