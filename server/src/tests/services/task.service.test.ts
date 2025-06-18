import { TaskService } from '../../services/tark.service';
import { prisma } from '../../utils/prisma';


jest.mock('../../utils/prisma', () => ({
    prisma: {
        task: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
    },
}));

describe('TaskService.createTask', () => {
    const mockUserId = 1;
    it('deve criar a tarefa normalmente se o nome for valido', async () => {
        const dadosValidos = {
            title: 'Tarefa válida',
            description: 'Descrição',
        };
        const mockTarefaCriada = {
            id: 42,
            ...dadosValidos,
            dueDate: null,
            priority: null,
            userId: mockUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        (prisma.task.create as jest.Mock).mockResolvedValue(mockTarefaCriada);
        const tarefa = await TaskService.createTask(mockUserId, dadosValidos);
        expect(prisma.task.create).toHaveBeenCalledWith({
            data: {
                ...dadosValidos,
                dueDate: null,
                priority: undefined,
                userId: mockUserId,
            },
        });
        expect(tarefa).toEqual(mockTarefaCriada);
    });

    it('deve lançar erro se o nome da tarefa começar com número', async () => {
        const dadosInvalidos = {
            title: '123Tarefa',
            description: 'Tarefa',
        };
        await expect(TaskService.createTask(mockUserId, dadosInvalidos)).rejects.toThrow(
            'o nome da tarefa não pode começar com número',
        );
    });

    it('deve lançar erro se o nome da tarefa estiver vazio ou só com espaços', async () => {
        const dadosInvalidos = {
            title: '   ',
            description: 'Tarefa inválida',
        };

        await expect(TaskService.createTask(mockUserId, dadosInvalidos)).rejects.toThrow(
            'o nome da tarefa é obrigatório',
        );
    });

    it('deve criar a tarefa normalmente se o título contiver números, mas não começar com eles', async () => {
        const dadosValidos = {
            title: 'Tarefa 123',
            description: 'Descrição com número no título',
        };

        const mockTarefaCriada = {
            id: 100,
            ...dadosValidos,
            dueDate: null,
            priority: null,
            userId: mockUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (prisma.task.create as jest.Mock).mockResolvedValue(mockTarefaCriada);

        const tarefa = await TaskService.createTask(mockUserId, dadosValidos);

        expect(prisma.task.create).toHaveBeenCalledWith({
            data: {
                ...dadosValidos,
                dueDate: null,
                priority: undefined,
                userId: mockUserId,
            },
        });

        expect(tarefa).toEqual(mockTarefaCriada);
    });
});



describe('TaskService.updateTask', () => {
    it('deve atualizar uma tarefa existente', async () => {
        const mockUserId = 1;
        const mockTaskId = 1;
        const dadosAtualizados = { title: 'Tarefa Atualizada', description: 'Nova descrição' };
        const mockTarefaAtualizada = {
            id: mockTaskId,
            ...dadosAtualizados,
            dueDate: null,
            priority: null,
            userId: mockUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        (prisma.task.update as jest.Mock).mockResolvedValue(mockTarefaAtualizada);

        const tarefa = await TaskService.updateTask(mockUserId, mockTaskId, dadosAtualizados);

        expect(prisma.task.update).toHaveBeenCalledWith({
            where: { id: mockTaskId },
            data: dadosAtualizados,
        });
        expect(tarefa).toEqual(mockTarefaAtualizada);
    });

    it('deve lançar erro ao tentar atualizar tarefa inexistente', async () => {
        const mockUserId = 1;
        const mockTaskId = 999;
        (prisma.task.update as jest.Mock).mockRejectedValue(new Error('Tarefa não encontrada'));

        await expect(TaskService.updateTask(mockUserId, mockTaskId, { title: 'Teste', description: 'Teste' }))
            .rejects.toThrow('Tarefa não encontrada');
    });
});

describe('TaskService.deleteTask', () => {
    it('deve deletar uma tarefa existente', async () => {
        const mockUserId = 1;
        const mockTaskId = 1;
        const mockTarefaDeletada = { id: mockTaskId };
        (prisma.task.delete as jest.Mock).mockResolvedValue(mockTarefaDeletada);

        const tarefa = await TaskService.deleteTask(mockUserId, mockTaskId);

        expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: mockTaskId } });
        expect(tarefa).toEqual(mockTarefaDeletada);
    });

    it('deve lançar erro ao tentar deletar tarefa inexistente', async () => {
        const mockUserId = 1;
        const mockTaskId = 999;
        (prisma.task.delete as jest.Mock).mockRejectedValue(new Error('Tarefa não encontrada'));

        await expect(TaskService.deleteTask(mockUserId, mockTaskId)).rejects.toThrow('Tarefa não encontrada');
    });
});

describe('TaskService.getTaskById', () => {
    it('deve retornar a tarefa se existir', async () => {
        const mockUserId = 1;
        const mockTaskId = 1;
        const mockTarefa = {
            id: mockTaskId,
            title: 'Tarefa',
            description: 'Descrição',
            dueDate: null,
            priority: null,
            userId: mockUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTarefa);

        const tarefa = await TaskService.getTaskById(mockUserId, mockTaskId);

        expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: mockTaskId } });
        expect(tarefa).toEqual(mockTarefa);
    });

    it('deve retornar null se a tarefa não existir', async () => {
        const mockUserId = 1;
        const mockTaskId = 999;
        (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

        const tarefa = await TaskService.getTaskById(mockUserId, mockTaskId);

        expect(tarefa).toBeNull();
    });
});




