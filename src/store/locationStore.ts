import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    addCountry: (country: Omit<Country, 'id'>) => void;
    updateCountry: (id: string, updates: Partial<Country>) => void;
    deleteCountry: (id: string) => void;
    addState: (state: Omit<State, 'id'>) => void;
    updateState: (id: string, updates: Partial<State>) => void;
    deleteState: (id: string) => void;
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
            countries: [
                { id: '1', name: 'United States', code: 'US', status: 'active' },
                { id: '2', name: 'India', code: 'IN', status: 'active' },
                { id: '3', name: 'United Kingdom', code: 'UK', status: 'active' },
            ],
            states: [
                { id: '1', name: 'California', countryId: '1', countryName: 'United States', status: 'active' },
                { id: '2', name: 'Texas', countryId: '1', countryName: 'United States', status: 'active' },
                { id: '3', name: 'Maharashtra', countryId: '2', countryName: 'India', status: 'active' },
                { id: '4', name: 'Karnataka', countryId: '2', countryName: 'India', status: 'active' },
            ],
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
            addCountry: (country) =>
                set((state) => ({
                    countries: [...state.countries, { ...country, id: Date.now().toString() }],
                })),
            updateCountry: (id, updates) =>
                set((state) => ({
                    countries: state.countries.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                })),
            deleteCountry: (id) =>
                set((state) => ({
                    countries: state.countries.filter((c) => c.id !== id),
                })),
            addState: (s) =>
                set((state) => ({
                    states: [...state.states, { ...s, id: Date.now().toString() }],
                })),
            updateState: (id, updates) =>
                set((state) => ({
                    states: state.states.map((s) => (s.id === id ? { ...s, ...updates } : s)),
                })),
            deleteState: (id) =>
                set((state) => ({
                    states: state.states.filter((s) => s.id !== id),
                })),
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
