# Migrating HTML to Laravel Blade Templates

This guide outlines the steps to convert your static HTML files into Laravel Blade templates.

## 1. Asset Preparation

Move your static assets to the Laravel `public` directory:

1.  Create `public/css` and move `style.css` there.
2.  Create `public/js` and move `scripts.js` there.
3.  If you have images, move them to `public/images`.

## 2. Create the Master Layout

Create a new file `resources/views/layouts/app.blade.php`. This file will hold the common HTML structure (Head, Navbar, Footer, Scripts).

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'HelloDevOps')</title>
    
    <!-- Preconnect -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="preconnect" href="https://i.pravatar.cc">
    <link rel="preconnect" href="https://www.youtube.com">

    <!-- CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
    
    @stack('styles')
</head>
<body class="@yield('body-class')">

    <!-- Preloader -->
    <div id="preloader">
        <div class="spinner"></div>
    </div>

    <!-- Navbar -->
    @include('partials.navbar')

    <!-- Main Content -->
    @yield('content')

    <!-- Footer -->
    @include('partials.footer')

    <!-- Common Modals -->
    @include('partials.contact-modal')
    @include('partials.cookie-banner')

    <!-- Page Specific Modals -->
    @stack('modals')

    <!-- Back to Top -->
    <a href="#" class="back-to-top btn btn-warning rounded-circle"><i class="bi bi-arrow-up"></i></a>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/scripts.js') }}"></script>
    @stack('scripts')
</body>
</html>
```

## 3. Create Partials

Create a `resources/views/partials` folder and extract common sections.

**`resources/views/partials/navbar.blade.php`**
Copy the `<nav>` HTML here. Update links to use Laravel helpers:
```html
<a class="navbar-brand" href="{{ route('home') }}">...</a>
<li class="nav-item"><a class="nav-link" href="{{ url('/#courses') }}">Courses</a></li>
<li class="nav-item"><a class="nav-link" href="{{ route('blog.index') }}">Blog</a></li>
```

**`resources/views/partials/footer.blade.php`**
Copy the `<footer>` HTML here.

**`resources/views/partials/contact-modal.blade.php`**
Copy the Contact Modal HTML here.

**`resources/views/partials/cookie-banner.blade.php`**
Copy the Cookie Banner HTML here.

## 4. Migrate Pages

### Homepage (`index.html`) -> `resources/views/home.blade.php`

```blade
@extends('layouts.app')

@section('title', 'Home | HelloDevOps')

@section('content')
    <!-- Hero Section -->
    <section class="text-center section-padding fade-in-section">
        <!-- Copy Hero content from index.html -->
    </section>

    <!-- Courses Section -->
    <section id="courses" class="section-padding bg-lighter fade-in-section">
        <!-- Copy Courses content. 
             Note: If you are using DB data, loop through $courses here instead of static HTML 
        -->
    </section>

    <!-- Features, Testimonials, etc. -->
@endsection

@push('modals')
    <!-- Demo Video Modal HTML -->
@endpush
```

### Course Page (`docker.html`) -> `resources/views/courses/docker.blade.php`

```blade
@extends('layouts.app')

@section('title', 'Docker Administration | HelloDevOps')
@section('body-class', 'home-page')

@section('content')
    <section class="py-5 fade-in-section">
        <div class="container">
            <h1 class="fw-bold">Docker Administration</h1>
            <p class="lead text-white-50">Learn to build, manage, and secure Docker containers in production</p>
        </div>
    </section>

    <!-- Copy the rest of the sections from docker.html -->
@endsection

@push('modals')
    <!-- Syllabus Modal HTML -->
    <!-- Share Modal HTML -->
@endpush
```

## 5. Define Routes

Update `routes/web.php` to serve your new views.

```php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/courses/docker', function () {
    return view('courses.docker');
})->name('courses.docker');

Route::get('/blog', function () {
    return view('blog.index');
})->name('blog.index');
```