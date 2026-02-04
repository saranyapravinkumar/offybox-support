import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { locationApi } from '../services/locationApi';

export interface Country {
    id: string;
    name: string;
    code: string;
    status: 'active' | 'inactive';
}

export interface State {
    id: string;
    name: string;
    countryId: string;
    countryName: string;
    status: 'active' | 'inactive';
}

export interface City {
    id: string;
    name: string;
    stateId: string;
    stateName: string;
    status: 'active' | 'inactive';
}

export interface Area {
    id: string;
    name: string;
    cityId: string;
    cityName: string;
    pincode: string;
    status: 'active' | 'inactive';
}

interface LocationState {
    countries: Country[];
    states: State[];
    cities: City[];
    areas: Area[];
    isLoading: boolean;
    error: string | null;
    fetchCountries: () => Promise<void>;
    addCountry: (country: Omit<Country, 'id'>) => Promise<void>;
    updateCountry: (id: string, updates: Partial<Country>) => Promise<void>;
    deleteCountry: (id: string) => Promise<void>;
    fetchStates: () => Promise<void>;
    addState: (state: Omit<State, 'id'>) => Promise<void>;
    updateState: (id: string, updates: Partial<State>) => Promise<void>;
    deleteState: (id: string) => Promise<void>;
    addCity: (city: Omit<City, 'id'>) => void;
    updateCity: (id: string, updates: Partial<City>) => void;
    deleteCity: (id: string) => void;
    addArea: (area: Omit<Area, 'id'>) => void;
    updateArea: (id: string, updates: Partial<Area>) => void;
    deleteArea: (id: string) => void;
}

export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            countries: [],
            states: [],
            cities: [
                { id: '1', name: 'Los Angeles', stateId: '1', stateName: 'California', status: 'active' },
                { id: '2', name: 'San Francisco', stateId: '1', stateName: 'California', status: 'active' },
                { id: '3', name: 'Mumbai', stateId: '3', stateName: 'Maharashtra', status: 'active' },
                { id: '4', name: 'Bangalore', stateId: '4', stateName: 'Karnataka', status: 'active' },
            ],
            areas: [
                { id: '1', name: 'Downtown', cityId: '1', cityName: 'Los Angeles', pincode: '90001', status: 'active' },
                { id: '2', name: 'Bandra', cityId: '3', cityName: 'Mumbai', pincode: '400050', status: 'active' },
                { id: '3', name: 'Koramangala', cityId: '4', cityName: 'Bangalore', pincode: '560034', status: 'active' },
            ],
            isLoading: false,
            error: null,
            fetchCountries: async () => {
                set({ isLoading: true, error: null });
                try {
                    const countries = await locationApi.fetchCountries();
                    set({ countries, isLoading: false });
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },
            addCountry: async (country) => {
                set({ isLoading: true, error: null });
                try {
                    const newCountry = await locationApi.createCountry(country);
                    set((state) => ({
                        countries: [...state.countries, newCountry],
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },
            updateCountry: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const updatedCountry = await locationApi.updateCountry(id, updates);
                    set((state) => ({
                        countries: state.countries.map((c) => (c.id === id ? updatedCountry : c)),
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },
            deleteCountry: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await locationApi.deleteCountry(id);
                    set((state) => ({
                        countries: state.countries.filter((c) => c.id !== id),
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },
            fetchStates: async () => {
                set({ isLoading: true, error: null });
                try {
                    const states = await locationApi.fetchStates();
                    set({ states, isLoading: false });
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },
            addState: async (state) => {
                set({ isLoading: true, error: null });
                try {
                    const newState = await locationApi.createState(state);
                    set((s) => ({
                        states: [...s.states, newState],
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },
            updateState: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const updatedState = await locationApi.updateState(id, updates);
                    set((s) => ({
                        states: s.states.map((state) => (state.id === id ? updatedState : state)),
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },
            deleteState: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await locationApi.deleteState(id);
                    set((s) => ({
                        states: s.states.filter((state) => state.id !== id),
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },
            addCity: (city) =>
                set((state) => ({
                    cities: [...state.cities, { ...city, id: Date.now().toString() }],
                })),
            updateCity: (id, updates) =>
                set((state) => ({
                    cities: state.cities.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                })),
            deleteCity: (id) =>
                set((state) => ({
                    cities: state.cities.filter((c) => c.id !== id),
                })),
            addArea: (area) =>
                set((state) => ({
                    areas: [...state.areas, { ...area, id: Date.now().toString() }],
                })),
            updateArea: (id, updates) =>
                set((state) => ({
                    areas: state.areas.map((a) => (a.id === id ? { ...a, ...updates } : a)),
                })),
            deleteArea: (id) =>
                set((state) => ({
                    areas: state.areas.filter((a) => a.id !== id),
                })),
        }),
        { name: 'location-storage' }
    )
);
