import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, map } from 'rxjs';

const GET_BOOKS = gql`
  {
    books {
      books {
        _id
        name
        genre
      }
    }
  }
`;
const CREATE_BOOK = gql`
  mutation createbooks($name: String!, $genre: String!) {
    createbooks(bookInput: { name: $name, genre: $genre }) {
      name
      genre
    }
  }
`;

const DELETE_BOOK = gql`
  mutation deletebooks($id: ID!) {
    deletebooks(id: $id) {
      name
      genre
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation updatebooks($id: ID!, $name: String!, $genre: String!) {
    updatebooks(id: $id, bookInput: { name: $name, genre: $genre }) {
      name
      genre
    }
  }
`;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontEnd';

  books: Observable<any> | undefined;
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.books = this.apollo
      .watchQuery({
        query: GET_BOOKS,
      })
      .valueChanges.pipe(
        map((result: any) => {
          console.log(result.data.books.books);
          return result.data.books.books;
        })
      );
  }

  create(name: string, genre: string) {
    console.log(name, genre);
    this.apollo
      .mutate({
        mutation: CREATE_BOOK,
        refetchQueries: [{ query: GET_BOOKS }],
        variables: {
          name: name,
          genre: genre,
        },
      })
      .subscribe(() => {
        console.log('created');
      });
  }

  deleteBook(id: string) {
    this.apollo
      .mutate({
        mutation: DELETE_BOOK,
        refetchQueries: [{ query: GET_BOOKS }],
        variables: {
          id: id,
        },
      })
      .subscribe(() => {
        console.log('deleted');
      });
  }
  update(id: string) {}
}
