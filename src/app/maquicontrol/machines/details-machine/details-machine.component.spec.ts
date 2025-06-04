import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsMachineComponent } from './details-machine.component';

describe('DetailsMachineComponent', () => {
  let component: DetailsMachineComponent;
  let fixture: ComponentFixture<DetailsMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsMachineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
