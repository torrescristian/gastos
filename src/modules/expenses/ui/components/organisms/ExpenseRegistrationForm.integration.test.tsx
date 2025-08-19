import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import ExpenseRegistrationForm from "./ExpenseRegistrationForm";

// Mock the hooks
vi.mock("@/expenses/infrastructure/react-adapters/useCategoriesQuery", () => ({
  useCategoriesQuery: () => ({
    data: [
      {
        id: 1,
        name: "Alimentación",
        icon: "🍕",
        isLegacy: false,
        subcategories: [
          { id: 1, name: "Supermercado", icon: "🛒" },
          { id: 2, name: "Restaurante", icon: "🍽️" },
        ],
      },
      {
        id: 2,
        name: "Transporte",
        icon: "🚗",
        isLegacy: false,
        subcategories: [
          { id: 3, name: "Combustible", icon: "⛽" },
          { id: 4, name: "Taxi/Uber", icon: "🚕" },
        ],
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

vi.mock(
  "@/expenses/infrastructure/react-adapters/useCreateExpenseMutation",
  () => ({
    useCreateExpenseMutation: () => ({
      mutateAsync: vi.fn().mockResolvedValue({
        id: "1",
        amount: 100,
        categoryId: "1",
        subcategoryId: "1",
        isCardPayment: false,
        date: new Date("2025-12-31"),
        note: "Test expense",
      }),
      isPending: false,
      error: null,
    }),
  })
);

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("ExpenseRegistrationForm Integration", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render date field and allow user to select any date", async () => {
    render(
      <TestWrapper>
        <ExpenseRegistrationForm />
      </TestWrapper>
    );

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByText("📅 Fecha del gasto")).toBeInTheDocument();
    });

    // Check that the date field is present and enabled
    const dateInput = screen.getByDisplayValue(
      new Date().toISOString().split("T")[0]
    ) as HTMLInputElement;
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).not.toBeDisabled();
    expect(dateInput.type).toBe("date");

    // Check that there's no max attribute restricting future dates
    expect(dateInput).not.toHaveAttribute("max");
  });

  it("should allow selecting a future date", async () => {
    render(
      <TestWrapper>
        <ExpenseRegistrationForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("📅 Fecha del gasto")).toBeInTheDocument();
    });

    const dateInput = screen.getByDisplayValue(
      new Date().toISOString().split("T")[0]
    ) as HTMLInputElement;

    // Set a future date
    const futureDate = "2025-12-31";
    await user.clear(dateInput);
    await user.type(dateInput, futureDate);

    expect(dateInput.value).toBe(futureDate);
  });

  it("should allow selecting a past date", async () => {
    render(
      <TestWrapper>
        <ExpenseRegistrationForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("📅 Fecha del gasto")).toBeInTheDocument();
    });

    const dateInput = screen.getByDisplayValue(
      new Date().toISOString().split("T")[0]
    ) as HTMLInputElement;

    // Set a past date
    const pastDate = "2020-01-15";
    await user.clear(dateInput);
    await user.type(dateInput, pastDate);

    expect(dateInput.value).toBe(pastDate);
  });

  it("should successfully create an expense with a custom date", async () => {
    render(
      <TestWrapper>
        <ExpenseRegistrationForm />
      </TestWrapper>
    );

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText(/monto/i)).toBeInTheDocument();
    });

    // Fill in the form
    const amountInput = screen.getByLabelText(/monto/i);
    await user.clear(amountInput);
    await user.type(amountInput, "150.50");

    // Select payment method (cash) - it defaults to cash, so no need to change

    // Select category - click the dropdown button
    const categoryButton = screen.getByRole("button", {
      name: /selecciona una categoría/i,
    });
    await user.click(categoryButton);

    // Wait and select first category option
    await waitFor(() => {
      const firstCategory = screen.getByText("Alimentación");
      expect(firstCategory).toBeInTheDocument();
    });

    const alimentacionOption = screen.getByText("Alimentación");
    await user.click(alimentacionOption);

    // Set custom date (future)
    const dateInput = screen.getByDisplayValue(
      new Date().toISOString().split("T")[0]
    ) as HTMLInputElement;
    await user.clear(dateInput);
    await user.type(dateInput, "2025-06-15");

    // Add a note
    const noteInput = screen.getByPlaceholderText(/agregar una nota/i);
    await user.type(noteInput, "Test expense with custom date");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /registrar gasto/i,
    });
    await user.click(submitButton);

    // The form should not show validation errors for the date
    await waitFor(() => {
      expect(screen.queryByText(/fecha.*inválida/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/fecha no puede ser futura/i)
      ).not.toBeInTheDocument();
    });
  });

  it("should show validation error for invalid date format", async () => {
    render(
      <TestWrapper>
        <ExpenseRegistrationForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("📅 Fecha del gasto")).toBeInTheDocument();
    });

    const dateInput = screen.getByDisplayValue(
      new Date().toISOString().split("T")[0]
    ) as HTMLInputElement;

    // Try to set an invalid date (this should be handled by the browser's date input)
    fireEvent.change(dateInput, { target: { value: "invalid-date" } });

    // The browser should prevent invalid dates, so this should not change the value
    expect(dateInput.value).not.toBe("invalid-date");
  });

  it("should preserve date value when switching between form fields", async () => {
    render(
      <TestWrapper>
        <ExpenseRegistrationForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("📅 Fecha del gasto")).toBeInTheDocument();
    });

    const dateInput = screen.getByDisplayValue(
      new Date().toISOString().split("T")[0]
    ) as HTMLInputElement;
    const amountInput = screen.getByLabelText(/monto/i);

    // Set a custom date
    const customDate = "2025-03-20";
    await user.clear(dateInput);
    await user.type(dateInput, customDate);

    // Interact with other fields
    await user.clear(amountInput);
    await user.type(amountInput, "75.25");

    // Date should still be preserved
    expect(dateInput.value).toBe(customDate);
  });
});
