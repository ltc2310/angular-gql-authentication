import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/shared/course.service';
import { AlertService } from 'ngx-alerts';
import { NgForm } from '@angular/forms';
import { Course } from 'src/app/shared/course.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  constructor(
    public service: CourseService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null) {
      form.resetForm();
    }
    this.service.formCourse = {
      id: null,
      title: '',
      description: '',
      topic: '',
      imageLink: ''
    };
  }

  onSubmit(form: NgForm) {
    const course = { ...form.value };
    delete course.id;
    if (form.value.id) {
      this.editCourse(form.value.id, course);
    } else {
      this.addCourse(course);
    }
    this.resetForm(form);
  }

  addCourse(course: Course) {
    const imageLink = this.service.getImageLink(course.imageLink);
    this.spinner.show();
    this.service.addCourse(course.title, course.topic, course.description, imageLink).subscribe(result => {
      if (result.data) {
        this.alertService.success('Add course successfully');
        this.spinner.hide();
        this.service.refreshPage();
      }
    }, (error) => {
      this.alertService.danger(`Fail to add course ${error.message}`);
      this.spinner.hide();
    });
  }

  editCourse(id: string, course: Course) {
    this.spinner.show();
    this.service.updateCourse(id, course.title, course.topic, course.description, course.imageLink).subscribe(result => {
      if (result.data) {
        this.alertService.success('Update course successfully');
        this.spinner.hide();
        this.service.refreshPage();
      }
    }, (error) => {
      this.alertService.danger(`Fail to update course ${error.message}`);
      this.spinner.hide();
    });
  }

}
