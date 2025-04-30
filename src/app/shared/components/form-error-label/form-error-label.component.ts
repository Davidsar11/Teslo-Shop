import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormUtils } from '@utils/form.utils';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
})
export class FormErrorLabelComponent {
  control = input.required<AbstractControl>();

  get errorMessage() {
    const error = this.control().errors || {};

    return this.control().touched && Object.keys(error).length > 0
      ? FormUtils.getTextError(error)
      : null;
  }
}
