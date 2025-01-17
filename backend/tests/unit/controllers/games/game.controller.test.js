import { GameController } from '../../../../controllers/games/game.controller.js';
import Game from '../../../../models/Game.js';
import mongoose from 'mongoose';

jest.mock('../../../../models/Game.js');

describe('Game Controller', () => {
    let gameController;
    let mockReq;
    let mockRes;
    let mockGame;

    beforeEach(() => {
        gameController = new GameController();
        mockReq = {
            user: {
                _id: new mongoose.Types.ObjectId()
            },
            body: {},
            params: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockGame = {
            _id: new mongoose.Types.ObjectId(),
            title: 'Test Game',
            platform: 'PC',
            translationLead: mockReq.user._id,
            save: jest.fn()
        };
        Game.findById.mockResolvedValue(mockGame);
    });

    describe('createGame', () => {
        it('debería crear un nuevo juego', async () => {
            mockReq.body = {
                title: 'Test Game',
                platform: 'PC'
            };
            Game.create.mockResolvedValue(mockGame);

            await gameController.createGame(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockGame);
        });

        it('debería validar campos requeridos', async () => {
            await gameController.createGame(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Título y plataforma son requeridos'
            });
        });
    });
}); 