import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Listing } from '@workspace/api-client-react';

interface CompareStore {
  selectedCars: Listing[];
  addCar: (car: Listing) => void;
  removeCar: (carId: number) => void;
  clearCars: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      selectedCars: [],
      addCar: (car) => set((state) => {
        if (state.selectedCars.length >= 3) return state;
        if (state.selectedCars.find(c => c.id === car.id)) return state;
        return { selectedCars: [...state.selectedCars, car] };
      }),
      removeCar: (carId) => set((state) => ({
        selectedCars: state.selectedCars.filter((c) => c.id !== carId)
      })),
      clearCars: () => set({ selectedCars: [] }),
    }),
    {
      name: 'dzcars-compare-storage',
    }
  )
);
