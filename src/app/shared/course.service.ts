import { Injectable } from '@angular/core';
import { Course } from './course.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  formCourse: Course;
  constructor(
    private apollo: Apollo
  ) { }

  getImageLink = (imageLink: string) => {
    const imageUrlRegex = RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/);
    const defaultImageUrl = 'https://d3gthpli891tsj.cloudfront.net/wp-content/uploads/2019/01/22063215/GATE-Crash-Course.jpg';
    if (imageUrlRegex.test(imageLink)) {
      return imageLink;
    }
    return defaultImageUrl;
  }

  getCourseList(itemPerPage: number, currentPage: number): Observable<any> {
    const CoursesQuery = gql`
    query getCourseList($itemPerPage: Int, $currentPage: Int) {
      getCourseList(itemPerPage: $itemPerPage, currentPage: $currentPage) {
        data {
          id,
          title
          topic
          description
          imageLink
        }
        pagination {
          itemPerPage
          totalCount
          currentPage
        }
      }
    }
    `;
    return this.apollo.watchQuery({
      query: CoursesQuery,
      variables: {
        itemPerPage,
        currentPage
      }
    }).valueChanges;
  }

  addCourse(title: string, topic: string, description: string, imageLink: string): Observable<any> {
    const mutationAddCourse = gql`
    mutation addCourse($title: String!, $topic: String!, $description: String, $imageLink: String) {
      addCourse(title: $title, topic: $topic, description: $description, imageLink: $imageLink) {
        id
      }
    }
  `;
    return this.apollo.mutate({
      mutation: mutationAddCourse,
      variables: {
        title,
        topic,
        description,
        imageLink
      }
    });
  }

  updateCourse(id: string, title: string, topic: string, description: string, imageLink: string): Observable<any> {
    const mutationUpdateCourse = gql`
    mutation updateCourse($id: String!, $title: String, $topic: String, $description: String, $imageLink: String) {
      updateCourse(id: $id, title: $title, topic: $topic, description: $description, imageLink: $imageLink) {
        id
      }
    }
  `;
    return this.apollo.mutate({
      mutation: mutationUpdateCourse,
      variables: {
        id,
        title,
        topic,
        description,
        imageLink
      }
    });
  }

  deleteCourse(id: string): Observable<any> {
    const mutationDeleteCourse = gql`
    mutation deleteCourse($id: String!) {
      deleteCourse(id: $id) {
        id
      }
    }
  `;
    return this.apollo.mutate({
      mutation: mutationDeleteCourse,
      variables: {
        id
      }
    });
  }

  getCourseById(id: string) {
    const CourseQuery = gql`
    query getCourse($id: number) {
      getCourse(id: $id) {
        id
        title
        topic
        description
        imageLink
      }
    }
    `;
    return this.apollo.watchQuery({
      query: CourseQuery,
      variables: {
        id
      }
    }).valueChanges;
  }

  refreshPage() {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

}
