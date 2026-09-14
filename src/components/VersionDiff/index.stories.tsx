import RootLayout from "@/layouts/RootLayout";
import { diffLines, toHunks } from "@/utils/helpers/versionDiff";

import VersionDiff from ".";

import type { StoryFn, Meta } from "@storybook/react";

export default {
  title: "Components/Models/VersionDiff",
  component: VersionDiff,
} as Meta<typeof VersionDiff>;

const Template: StoryFn<typeof VersionDiff> = (args) => (
  <RootLayout>
    <VersionDiff {...args} />
  </RootLayout>
);

export const Default = Template.bind({});

Default.args = {
  hunks: toHunks(
    diffLines(
      "cubes:\n  - name: Orders\n    sql: SELECT * FROM old_orders\n    joins: []\n",
      "cubes:\n  - name: Orders\n    sql: SELECT * FROM orders\n    joins: []\n"
    )
  ),
};
