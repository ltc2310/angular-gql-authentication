import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { CourseService } from 'src/app/shared/course.service';
import { Course } from 'src/app/shared/course.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  courses: [Course];
  page = {
    size: 5,
    pageNumber: 0,
    totalElements: 0,
    totalPages: 0
  };

  isLoading: boolean = false;


  constructor(
    private service: CourseService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.setPage(0);
  }

  onSelect({ selected }) {
    const { id, title, topic, description, imageLink } = selected[0];
    this.service.formCourse = { ...this.service.formCourse, id, title, topic, description, imageLink };
  }

  setPage(pageInfo) {
    this.isLoading = true;
    this.spinner.show();
    this.page.pageNumber = pageInfo !== 0 ? pageInfo.offset + 1 : 1;
    this.page.size = pageInfo !== 0 ? pageInfo.pageSize : 5;

    this.service.getCourseList(this.page.size, this.page.pageNumber).subscribe(result => {
      if (result.data) {
        const { data, pagination } = result.data.getCourseList;
        this.courses = data;
        this.page.size = pagination.itemPerPage;
        this.page.pageNumber = pagination.currentPage - 1;
        this.page.totalElements = pagination.totalCount;
        this.isLoading = false;
        this.spinner.hide();
      }
    }, (error) => {
      this.alertService.danger(`Fail to load courses ${error.message}`);
      this.isLoading = false;
      this.spinner.hide();
    });
  }

  onDelete(id: string) {
    if (confirm('Are you sure to delete this record?')) {
      this.spinner.show();
      this.service.deleteCourse(id).subscribe(result => {
        if (result.data) {
          this.alertService.warning('Delete course successfully');
          this.service.refreshPage();
          this.spinner.hide();
        }
      }, (error) => {
        this.alertService.danger(`Fail to delete course ${error.message}`);
        this.spinner.hide();
      });
    }
  }

}
