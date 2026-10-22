import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from '../../../shared/ui/dialog/dialog';
import { Sport, SportInput } from '../sport.model';
import { SportsService } from '../sports.service';

const URL_PATTERN = /^https?:\/\/\S+$/i;

/** Add / Edit sport dialog (Name, Description, Icon URL). */
@Component({
  selector: 'bz-sport-dialog',
  imports: [Dialog, ReactiveFormsModule],
  templateUrl: './sport-dialog.html',
  styleUrl: './sport-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportDialog implements OnInit {
  private readonly sports = inject(SportsService);

  /** Sport to edit; `null` opens the dialog in create mode. */
  readonly sport = input<Sport | null>(null);
  readonly saved = output<Sport>();
  readonly closed = output<void>();

  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly iconBroken = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    iconUrl: ['', [Validators.pattern(URL_PATTERN)]],
  });

  protected readonly iconPreview = toSignal(this.form.controls.iconUrl.valueChanges, {
    initialValue: '',
  });

  ngOnInit(): void {
    const sport = this.sport();
    if (sport) {
      this.form.setValue({
        name: sport.name,
        description: sport.description ?? '',
        iconUrl: sport.iconUrl ?? '',
      });
    }
  }

  protected get isEdit(): boolean {
    return this.sport() !== null;
  }

  protected invalid(field: 'name' | 'description' | 'iconUrl'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, description, iconUrl } = this.form.getRawValue();
    const payload: SportInput = { name: name.trim() };
    if (description.trim() || this.sport()) payload.description = description.trim();
    if (iconUrl.trim()) payload.iconUrl = iconUrl.trim();

    const sport = this.sport();
    const request = sport ? this.sports.update(sport.id, payload) : this.sports.create(payload);

    this.saving.set(true);
    this.errorMessage.set(null);
    request.subscribe({
      next: (result) => this.saved.emit(result),
      error: (err: unknown) => {
        this.saving.set(false);
        this.errorMessage.set(this.toMessage(err));
      },
    });
  }

  private toMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 409) return 'A sport with this name already exists.';
      if (err.status === 403) return 'Your account is not allowed to change the catalogue.';
      if (err.status === 0) return 'Unable to reach the server. Please try again.';
      return err.error?.error?.message ?? 'Could not save the sport. Please try again.';
    }
    return 'Could not save the sport. Please try again.';
  }
}
