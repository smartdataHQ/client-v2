import { describe, vi, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import { branchesMock } from "@/mocks/branches";

import { Models } from ".";

describe("<Models />", () => {
  const defaultProps = {
    branchMenu: [],
    ideMenu: [],
    branches: branchesMock,
    dataSources: [],
    onSetDefault: vi.fn(),
    onChangeBranch: vi.fn(),
    onCreateBranch: vi.fn(),
    onSchemaDelete: vi.fn(),
    onSchemaUpdate: vi.fn(),
    onSchemaCreate: vi.fn(),
    onCodeSave: vi.fn(),
    onRunSQL: vi.fn(),
    dataSchemaName: "",
    fetching: false,
    genSchemaModalVisible: false,
    versionsModalVisible: false,
    tablesSchema: {},
    schemaFetching: false,
    onModalClose: vi.fn(),
    onSaveVersion: vi.fn(),
    onGenSubmit: vi.fn(),
    onSmartGenComplete: vi.fn(),
    onDeleteBranch: vi.fn(),
    onDataSourceChange: vi.fn(),
    onConnect: vi.fn(),
  };

  test("displays no data source message if dataSources length is 0", () => {
    render(<Models {...defaultProps} />);
    expect(screen.getByText(/connect/)).toBeInTheDocument();
  });
});
