const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appDir = path.join(root, "app");
const exampleDir = path.join(root, "app-example");

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFileSync(filePath, content) {
  ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function resetProject() {
  if (!fs.existsSync(appDir)) {
    console.error("No app directory found to reset.");
    process.exit(1);
  }

  if (fs.existsSync(exampleDir)) {
    console.error("app-example already exists. Remove or rename it before resetting.");
    process.exit(1);
  }

  fs.renameSync(appDir, exampleDir);
  ensureDirSync(appDir);

  const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

  const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

  writeFileSync(path.join(appDir, "_layout.tsx"), layoutContent);
  writeFileSync(path.join(appDir, "index.tsx"), indexContent);

  console.log("Project reset complete.");
  console.log("Moved existing app to app-example and created a fresh app directory.");
}

resetProject();
