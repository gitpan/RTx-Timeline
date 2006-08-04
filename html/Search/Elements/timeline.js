<%init>
$RT::Logger->error($Query);

my $Tickets = RT::Tickets->new( $session{CurrentUser} );
$Tickets->FromSQL( $Query );
$Tickets->OrderBy( FIELD => 'id', ORDER => 'ASC' );

my %data = ( dateTimeFormat => 'iso8601' );
my $i;
while ( my $ticket = $Tickets->Next ) {
    #last if $i++ > 10;
    push @{$data{events}}, {
        start => $ticket->Created,
        ( $ticket->Resolved > $ticket->Created ? (end => $ticket->Resolved) : ()),
        title => $ticket->id,
        #isDuration => '1',
        description => $ticket->Subject,
        link  => "$RT::WebPath/Ticket/Display.html?id=".$ticket->id,
    }
}

$r->content_type('application/x-javascript');
$m->out( JSON::Syck::Dump( \%data ) );
$m->abort();
</%init>
<%args>
$Query
</%args>
<%once>
use JSON::Syck;
</%once>
