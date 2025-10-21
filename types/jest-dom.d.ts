/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeDisabled(): R;
      toBeVisible(): R;
      toHaveValue(value: string | string[] | number): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeInvalid(): R;
    }
  }
}

export {};
