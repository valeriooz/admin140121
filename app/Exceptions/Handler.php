<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use TypeError;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Throwable
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
            return  response()->json(['message' => 'Invalid route'], 404);
        } else if ($exception instanceof \Illuminate\Session\TokenMismatchException) {
            return  response()->json(['header' => 'Your session has expired.', 'message' => 'Please refresh the page and try again.'], 500);
        } else if ($exception instanceof \Illuminate\Auth\Access\AuthorizationException) {
            return response()->json(["message" => "You do not have the required permissions."], 403);
        } else if ($exception instanceof TypeError) {
            return response()->json(["message" => "You have passed an argument with an incorrect type"], 400);
        }

        return parent::render($request, $exception);
    }
}
