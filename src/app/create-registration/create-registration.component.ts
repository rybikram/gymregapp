import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit{
         public packages = ["Monthly", "Quarterly", "Yearly"];
         public genderes = ["male", "Female"];
         public importantList: string[]= [
          "Toxic fat reduction",
          "Energy and Endurance",
          "Building Learn Muscle",
          "Healthier Digestive syetem",
          "Suger craving body",
          "Fitness"
         ];

    registerForm: FormGroup;
    public userIdToUpdate: number;
    public isUpdateActive: boolean = false;
    constructor(private fb: FormBuilder,
       private activatedRoute: ActivatedRoute,
       private api: ApiService, 
       private router: Router,
       private taostService: NgToastService){
    }

    ngOnInit(): void {
      this.registerForm = this.fb.group({
         firstname: ['', Validators.required],
         lastname: [''],
         email: ['', [Validators.required, Validators.email]],
         mobile: ['', Validators.required],
         weight: ['', Validators.required],
         height:['', Validators.required],
         bmi: [''],
         bmiResult: [''],
         gender: ['', Validators.required],
         requireTrainer: ['', Validators.required],
         package: ['', Validators.required],
         important: [''],
         haveGymBefore:  ['', Validators.required],
         enquiryDate:  ['', Validators.required],

      })

      this.registerForm.controls['height'].valueChanges.subscribe(res =>{
        this.calculateBmi(res)
      })

      this.activatedRoute.params.subscribe(val=>{
        this.userIdToUpdate = val['id'];
        this.api.getRegisteredUserId(this.userIdToUpdate)
        .subscribe(res=>{
           this.isUpdateActive = true
           this.fillFormToUpdate(res)
        })
      })
    }

    submit(){
      this.api.postRegistration(this.registerForm.value)
      .subscribe(res =>{
        this.taostService.success({detail: "Success", summary: "Enquiry Added", duration: 3000});
        this.registerForm.reset();
      })
    }


    update(){
      this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate)
      .subscribe(res =>{
        this.taostService.success({detail: "Success", summary: "Enquiry Updated", duration: 3000});
        this.registerForm.reset();
        this.router.navigate(['list'])
      })
    }


    calculateBmi(heightValue: number){
      const weight = this.registerForm.value.weight
      const height = heightValue;
      const bmi = weight/(height * height);
      this.registerForm.controls['bmi'].patchValue(bmi)
      switch (true) {
        case bmi < 18.5:
          this.registerForm.controls['bmiResult'].patchValue('Underweight');
          break;
        case (bmi >=18.5 && bmi < 25):
          this.registerForm.controls['bmiResult'].patchValue('Normal');
          break;  
        case (bmi >=25 && bmi < 30):
          this.registerForm.controls['bmiResult'].patchValue('Overweight');
          break;    
      
        default:
          this.registerForm.controls['bmiResult'].patchValue('obese');
          break;
      }
    }

    fillFormToUpdate(user: User){
       this.registerForm.setValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          mobile: user.mobile,
          weight: user.weight,
          height: user.height,
          bmi: user.bmi,
          bmiResult: user.bmiResult,
          gender: user.gender,
          requireTrainer: user.requireTrainer,
          package: user.package,
          important: user.important,
          haveGymBefore: user.haveGymBefore,
          enquiryDate: user.enquiryDate,
       })
    }

 
}
