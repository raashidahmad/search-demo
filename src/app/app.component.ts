import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'search-demo';
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  fruits: string[] = ["Mango", "Grapes", "Apples", "Figs", "Dates"];
  fruitCtrl = new FormControl();
  filteredFruits!: Observable<string[]>;

  //config variables for chip list
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor() {
  }

  ngOnInit() {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterFruits(value))
    );
  }

  private filterFruits(value: string) {
    if (value) {
      const filteredValue = value.toLowerCase();
      return this.fruits.filter(f => f.toLowerCase().includes(filteredValue));
    } else {
      return this.fruits;
    }
  }

  addFruit(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    /*
    I have written a check here to ensure only make a pill of the value present in the autocomplete
    valid list
    */
    if (this.fruits.indexOf(value) != -1) {
      if (value) {
        this.fruits.push(value);
      }
    }
    event.chipInput!.clear();
  }

  removeFruit(fruit: string) : void {
    const index = this.fruits.indexOf(fruit);

    if (index != -1) {
      this.fruits.splice(index, 1);
    }
  }

  fruitSelected(e: MatAutocompleteSelectedEvent): void {
    let index = this.fruits.indexOf(e.option.viewValue);
    if (index == -1) {
      this.fruits.push(e.option.viewValue);
    }
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }
}
