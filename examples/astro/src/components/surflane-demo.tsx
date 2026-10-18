import {
  Button,
  Container,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  FieldControl,
  FieldDescription,
  FieldLabel,
  FieldRoot,
  Heading,
  Stack,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
  Text,
} from "@surflane/ui";

/** Flat part names keep this tree renderable from React Server Components. */
export function SurflaneDemo({ framework }: { framework: string }) {
  return (
    <Container width="reading">
      <Stack gap={6}>
        <Stack gap={2}>
          <Heading level={1} size="page">
            Surflane on {framework}
          </Heading>
          <Text color="secondary">
            Server-rendered components that hydrate into interactive controls.
          </Text>
        </Stack>
        <FieldRoot name="project">
          <FieldLabel>Project name</FieldLabel>
          <FieldControl placeholder="demo-preview" />
          <FieldDescription>Example data is fictional.</FieldDescription>
        </FieldRoot>
        <TabsRoot defaultValue="overview">
          <TabsList>
            <TabsTab value="overview">Overview</TabsTab>
            <TabsTab value="activity">Activity</TabsTab>
          </TabsList>
          <TabsPanel value="overview">
            Tokens and components ship as one versioned pair.
          </TabsPanel>
          <TabsPanel value="activity">No activity yet.</TabsPanel>
        </TabsRoot>
        <DialogRoot>
          <DialogTrigger render={<Button variant="primary" />}>
            Open dialog
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Surflane dialog</DialogTitle>
              <DialogDescription>Rendered by {framework}.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              Focus moves into the dialog and returns to the trigger on close.
            </DialogBody>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Close
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Stack>
    </Container>
  );
}
