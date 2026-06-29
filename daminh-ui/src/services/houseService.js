import apiClient from './apiClient';

export const HouseService = {
    // Gọi API GetAllHouses() từ C#
    getAllHouses: () => apiClient.get('/Houses'),
    
    // Gọi API CreateHouse() từ C#
    createHouse: (houseName) => apiClient.post('/Houses', JSON.stringify(houseName))
};