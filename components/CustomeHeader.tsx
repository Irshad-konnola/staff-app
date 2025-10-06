import { Menu, NasscriptLogo } from "@/constants/images";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/native";
import { Image } from "native-base";
import { Touchable, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "./Text";
import GradientBackground from "./gradientBg";
import SecondGradient from "./secondGradient";
import ThirdGradientColor from "./ThirdGradient";

export default function CustomeHeader({
  navigation,
  title = "",
}: {
  navigation: DrawerNavigationProp<ParamListBase, string, undefined>;
  title?: string;
}) {
  return (
    <View className="w-full h-24 px-4 flex items-end pb-4 flex-row  justify-between">
        <ThirdGradientColor/>
        {/* <SecondGradient /> */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        className="flex flex-row space-x-2 items-center"
      >
        <Image className="w-7 h-7" source={Menu} tintColor={"white"} />

        <Image source={NasscriptLogo} className="w-32 h-7 " />
      </TouchableOpacity>
      <View className="flex flex-row ">
        <Text fontFamily="KumbhSans-SemiBold" className="text-[21px] text-white">
          {title}
        </Text>
      </View>
    </View>
  );
}
