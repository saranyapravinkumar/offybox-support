import { apiRequest } from './apiClient';
import type { Country, State } from '../store/locationStore';

export const locationApi = {
    async fetchCountries(): Promise<Country[]> {
        return apiRequest<Country[]>('/countries');
    },

    async createCountry(country: Omit<Country, 'id'>): Promise<Country> {
        return apiRequest<Country>('/countries', {
            method: 'POST',
            body: JSON.stringify(country),
        });
    },

    async updateCountry(id: string, updates: Partial<Country>): Promise<Country> {
        return apiRequest<Country>(`/countries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    async deleteCountry(id: string): Promise<void> {
        return apiRequest<void>(`/countries/${id}`, {
            method: 'DELETE',
        });
    },

    // States
    async fetchStates(): Promise<State[]> {
        return apiRequest<State[]>('/states');
    },

    async createState(state: Omit<State, 'id'>): Promise<State> {
        return apiRequest<State>('/states', {
            method: 'POST',
            body: JSON.stringify(state),
        });
    },

    async updateState(id: string, updates: Partial<State>): Promise<State> {
        return apiRequest<State>(`/states/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    async deleteState(id: string): Promise<void> {
        return apiRequest<void>(`/states/${id}`, {
            method: 'DELETE',
        });
    },
};
