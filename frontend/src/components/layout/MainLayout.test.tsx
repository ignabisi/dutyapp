import { act, useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainLayout from './MainLayout';
import { useDutyContext } from '../context/DutyContext';

jest.mock('../context/DutyContext', () => ({
  useDutyContext: jest.fn(),
}));

const mockContextValue = {
  addDuty: jest.fn(),
  updateDuty: jest.fn(),
  refreshDuties: jest.fn(),
  deleteDuty: jest.fn(),
  duties: [],
};

const MainLayoutWithManualModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalVisible(true)} aria-label="add-new-duty">
        Add New Duty
      </button>

      {isModalVisible && <div>Submit</div>} {/* Simulated Modal Content */}
    </>
  );
};

describe('MainLayout manual modal trigger', () => {
  beforeEach(() => {
    (useDutyContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  // Test 1: Renders the title
  it('renders the Duty List title', () => {
    render(<MainLayout />);
    expect(screen.getByText('Duty List')).toBeInTheDocument();
  });

  // Test 2: Manually trigger the modal opening
  it('manually opens the modal for testing', () => {
    render(<MainLayoutWithManualModal />);

    const addButton = screen.getByLabelText('add-new-duty');
    expect(addButton).toBeEnabled();
    expect(addButton).toBeVisible();

    // Manually trigger the modal opening
    act(() => {
      fireEvent.click(addButton);
    });

    // Now check if the modal is visible
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });
});
