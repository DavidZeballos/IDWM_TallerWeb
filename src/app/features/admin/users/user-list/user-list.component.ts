import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/users/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  paginatedUsers: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers({}).subscribe({
      next: (data) => {
        this.users = data;
        this.updatePagination();
      },
      error: (err) =>
        this.toastr.error('Error al cargar usuarios: ' + err.message),
    });
  }

  toggleStatus(userId: string): void {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return;

    this.userService.changeUserStatus(userId, !user.status).subscribe({
      next: () => {
        user.status = !user.status;
        this.toastr.success('Estado actualizado correctamente.');
      },
      error: (err) =>
        this.toastr.error('Error al cambiar el estado: ' + err.message),
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.currentPage = newPage;
    this.updatePagination();
  }
}
