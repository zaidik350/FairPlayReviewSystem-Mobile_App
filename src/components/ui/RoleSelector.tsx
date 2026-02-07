import type { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type RoleOption = "Player" | "Umpire" | "Organizer" | "Fan";

export interface RoleSelectorProps {
  roles?: RoleOption[];
  selectedRole: RoleOption;
  onSelect: (role: RoleOption) => void;
  label?: string;
  renderIcon?: (role: RoleOption) => ReactNode;
}

const defaultRoles: RoleOption[] = ["Player", "Umpire", "Organizer", "Fan"];

export function RoleSelector({
  roles = defaultRoles,
  selectedRole,
  onSelect,
  label = "Select Role",
  renderIcon,
}: RoleSelectorProps) {
  return (
    <View className="mt-6">
      <Text className="text-white text-sm font-semibold mb-3">{label}</Text>
      <View className="flex-row flex-wrap justify-between">
        {roles.map((role) => {
          const isActive = selectedRole === role;
          return (
            <TouchableOpacity
              key={role}
              onPress={() => onSelect(role)}
              className={`w-[48%] py-3 mb-3 rounded-xl border ${
                isActive
                  ? "border-[#4F7CFF] bg-[#4F7CFF]/10"
                  : "border-[#2D333B]"
              }`}
            >
              <View className="flex-row items-center justify-center">
                {renderIcon ? (
                  <View className="mr-2">{renderIcon(role)}</View>
                ) : null}
                <Text
                  className={`text-center font-medium ${
                    isActive ? "text-[#4F7CFF]" : "text-gray-400"
                  }`}
                >
                  {role}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
