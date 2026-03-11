import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function AdditionalPage() {
  return (
    <Page>
      <TitleBar title="Edit Address Details" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                Edit Address Details
              </Text>
              <Text as="p" variant="bodyMd">
                This page is accessible at <Code>/app/additional</Code>.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                This is an example of an additional page in your app. You can add as many additional pages as you need, and link to them from the navigation menu in <Code>app.tsx</Code>.
              </Text>
              <Text as="p" variant="bodyMd">
                To create your own page and have it show up in the app navigation, add a page inside <Code>app/routes</Code>, and a link to it in the <Code>&lt;NavMenu&gt;</Code> component found in <Code>app.tsx</Code>.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
