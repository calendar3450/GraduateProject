import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosisController } from './diagnosis.controller';

describe('DiagnosisController', () => {
  let controller: DiagnosisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiagnosisController],
    }).compile();

    controller = module.get<DiagnosisController>(DiagnosisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
