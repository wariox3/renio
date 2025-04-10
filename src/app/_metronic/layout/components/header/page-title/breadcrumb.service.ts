// breadcrumb.service.ts
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
  isClickable: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    combineLatest([
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
      ),
      this.router.routerState.root.queryParams,
    ])
      .pipe(
        map(([_, queryParams]) => {
          try {
            return this.buildBreadcrumbs(this.activatedRoute.root, queryParams);
          } catch (error) {
            console.error('Error building breadcrumbs:', error);
            return [];
          }
        }),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
      )
      .subscribe((breadcrumbs) => {
        this.breadcrumbsSubject.next(breadcrumbs);
      });
  }

  private buildBreadcrumbs(
    route: ActivatedRoute | null,
    queryParams: any,
    url: string = '',
    breadcrumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    if (!route) {
      return breadcrumbs;
    }

    const children: ActivatedRoute[] = route.children || [];

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (!child.snapshot) continue;

      const routeURL: string = (child.snapshot.url || [])
        .map((segment) => segment?.path)
        .filter(Boolean)
        .join('/');
      const newUrl = routeURL ? `${url}/${routeURL}` : url;

      const breadcrumbData = child.snapshot.data?.breadcrumb;
      if (breadcrumbData) {
        const isDuplicate = breadcrumbs.some((b) => b.url === newUrl);
        if (!isDuplicate) {
          let label = breadcrumbData;

          if (
            typeof breadcrumbData === 'string' &&
            breadcrumbData.startsWith('query:')
          ) {
            const queryKey = breadcrumbData.split(':')[1];
            label = queryParams[queryKey] || queryKey;
          }

          breadcrumbs.push({
            label: this.formatLabel(label),
            url: newUrl,
            isClickable: this.isRouteClickable(child),
          });
        }
      }

      return this.buildBreadcrumbs(child, queryParams, newUrl, breadcrumbs);
    }

    return breadcrumbs;
  }

  private isRouteClickable(route: ActivatedRoute): boolean {
    return (
      !!route?.routeConfig?.component &&
      route.routeConfig.path !== '' &&
      route.routeConfig.path !== undefined
    );
  }

  private formatLabel(label: string): string {
    if (!label) return '';
    return label
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
