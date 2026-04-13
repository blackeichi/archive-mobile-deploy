import { Text, View } from "react-native";

export default function HomeTabScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "600" }}>
        Study Archive Mobile
      </Text>
      <Text style={{ marginTop: 8 }}>공부 저장소 모바일 앱입니다.</Text>
    </View>
  );
}
